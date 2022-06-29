import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import { AuthRoute } from './AuthRoute'

import axios from 'axios'
import axiosWithAuth from '../axios/index'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // console.log(spinnerOn)
  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    navigate('/'); /* ✨ implement */ }
  const redirectToArticles = () => {
    navigate('/articles') /* ✨ implement */ }

  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    
    const token = localStorage.getItem('token')
    if (token !== null) {
      return localStorage.removeItem("token"), setMessage("Goodbye!") 
    }
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    setMessage("")
    setSpinnerOn(true)
    axios.post(loginUrl, {username, password})
      .then(res => {
        // console.log(res, "App.js login log")
        localStorage.setItem("token", res.data.token)
        setMessage(res.data.message)
        navigate('/articles')
        // console.log(spinnerOn)
        // debugger
        setSpinnerOn(false)
      })
      .catch(err => {
        console.log(err)
      })
      
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }
  

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuth().get('/articles')
      .then(res => {
        // console.log(res, "getArticles log")
        res.status === 401 ? navigate('/') : setArticles(res.data.articles)
        setMessage(res.data.message)
        setSpinnerOn(false)
      })
      .catch(err => {
        console.log(err)
      })
      
  }

  //what is article supposed to be?????
  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    axiosWithAuth().post('/articles', article)
      .then(res => {
        console.log(res, "postArticle log")
        setArticles([...articles, res.data.article])
        setCurrentArticleId(res.data.article.article_id)
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
        setMessage(err.response.data.message)
      })
  }

  const updateArticle = ({ article_id, article }) => {
    // ✨ implement
    // You got this!
    axiosWithAuth().put(`/articles/${article_id}`, article)
      .then(res => {
        console.log(res, "updateArticle log")
        setArticles(articles.map(art => {
          if (art.article_id === res.data.article.article_id) {
            return res.data.article
          } else {
            return art
          }
        }))
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deleteArticle = (article_id) => {
    // ✨ implement
    axiosWithAuth().delete(`/articles/${article_id}`)
      .then(res => {
        // console.log(res, 'App.js, deleteArticle log')
        setArticles(articles.filter(article => article.article_id !== article_id));
        setMessage(res.data.message)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <AuthRoute>
              <ArticleForm 
                postArticle={postArticle} 
                setCurrentArticleId={setCurrentArticleId}  
                redirectToArticles={redirectToArticles}
                updateArticle={updateArticle}
                currentArticle={articles.find(x => x.article_id === currentArticleId)}
                currentArticleId={currentArticleId}
              />
              <Articles 
                getArticles={getArticles} 
                articles={articles} 
                deleteArticle={deleteArticle} 
                currentArticleId={currentArticleId}
                setCurrentArticleId={setCurrentArticleId}
                updateArticle={updateArticle}
              />
            </AuthRoute>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
