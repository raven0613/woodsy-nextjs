import Navbar from './navbar'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import ToTopButton from './toTopButton';
import ConfirmWindow from './confirmWindow';
import ArticleEditWindow from './article/articleEditWindow';
import React, { useRef } from 'react';

import useSWRMutation from 'swr/mutation'
import { fetchDeleteArticle, fetchEditArticle } from '../api_helpers/fetchers'
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, IUIContext } from '../type-config';


export const articleContext = React.createContext<IArticleContext>({})
export const UIContext = React.createContext<IUIContext>({})


export default function ArticleProvider({ children }: PropsWithChildren) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false)
  const [currentArticleId, setCurrentArticleId] = useState<number>(0)
  const [article, setArticle] = useState<Iarticle | null>()

  // fetcher 區
  //刪除文章
  const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<successResult, Error>(`article`, fetchDeleteArticle, {onSuccess: (data: successResult) => { 
      setRefetchTrigger(true)
  }});

  // 編輯文章
  const { trigger: editArtTrigger, isMutating: editArtIsMutating, data: editArtData, error: editArtError } = useSWRMutation<successResult, Error>(`article`, fetchEditArticle, {onSuccess: (data: successResult) => { 
      setRefetchTrigger(true)
  }});


  // function 區

  //刪除相關
  function handleDeleteArt (articleId: number) {
    deleteArtTrigger(articleId)
    // 關掉確認視窗
    handleConfirmWindow()
  }
  function handleArticleIdChange (articleId: number) {
    setCurrentArticleId(articleId)
  }
  function handleConfirmWindow () {
    // 關掉視窗前先把 articleId 歸零
    if (isConfirmOpen) {
      handleArticleIdChange(0)
    }
    setIsConfirmOpen(!isConfirmOpen)
  }

  // 編輯相關
  function handleEditWindow (article: Iarticle) {
    setArticle(article)
    setIsEditOpen(!isEditOpen)
  }
  function handleConfirmEdit (article: Iarticle) {
    console.log(article)
    editArtTrigger(article)
    setIsEditOpen(false)
  }
  
  function handleRefetchTrigger () {
    setRefetchTrigger(false)
  }

  // context value 區
  const articlecontextValue: IArticleContext = {
    currentArticleId,
    handleArticleIdChange,
    refetchTrigger,
    handleRefetchTrigger,
  }
  const UIcontextValue: IUIContext = {
    handleConfirmWindow,
    handleEditWindow
  }

  return (
    <>
      <UIContext.Provider value={UIcontextValue}>
        <articleContext.Provider value={articlecontextValue}>

          <main>{children}</main>
          {isConfirmOpen && <ConfirmWindow id={currentArticleId} 
          handleDeleteArt={handleDeleteArt} 
          handleConfirmWindow={handleConfirmWindow}/>}
          {article && isEditOpen && <ArticleEditWindow 
          handleConfirmEdit={handleConfirmEdit}
          handleEditWindow={handleEditWindow}
          article={article} />}

        </articleContext.Provider>
      </UIContext.Provider>
    </>
  )
}