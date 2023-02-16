import { useRouter } from 'next/router'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import ToTopButton from './toTopButton';
import ConfirmWindow from './confirmWindow';
import ArticleEditWindow from './article/articleEditWindow';
import React, { useRef } from 'react';

import useSWRMutation from 'swr/mutation'
import { fetchDeleteArticle, fetchEditArticle, fetchDeleteComments } from '../api_helpers/fetchers'
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, IUIContext } from '../type-config';


export const articleContext = React.createContext<IArticleContext>({})
export const UIContext = React.createContext<IUIContext>({})


export default function ArticleProvider({ children }: PropsWithChildren) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false)
  const [currentArticleId, setCurrentArticleId] = useState<number>(0)
  const [currentCommentId, setCurrentCommentId] = useState<number>(0)
  const [article, setArticle] = useState<Iarticle | null>()
  const router = useRouter()

  // fetcher 區
  //刪除文章
  const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<successResult, Error>(`article`, fetchDeleteArticle, {onSuccess: (data: successResult) => { 
    const path = location.pathname;
    if (!path.includes('home') && !path.includes('hollows')) return router.push('/home')
    setRefetchTrigger(true)
  }});
  // 編輯文章
  const { trigger: editArtTrigger, isMutating: editArtIsMutating, data: editArtData, error: editArtError } = useSWRMutation<successResult, Error>(`article`, fetchEditArticle, {onSuccess: (data: successResult) => { 
    setRefetchTrigger(true)
  }});
  // 刪除一條回覆
  const { trigger: deleteComTrigger, isMutating: deleteComIsMutating, data: deletedComData, error: deletedComError } = useSWRMutation<successResult, Error>(`comment`, fetchDeleteComments, {onSuccess: (data: successResult) => { 
    setRefetchTrigger(true)
  }});


  // function 區

  //刪除相關
  function handleDeleteArt (articleId: number) {
    deleteArtTrigger(articleId)
    // 關掉確認視窗
    handleConfirmWindow()
  }
  function handleDeleteComment (commentId: number) {
    deleteComTrigger(commentId)
    handleConfirmWindow()
  }
  // 每次都要先歸零 一次只能亮一個
  function handleIdChange (id: string) {
    setCurrentArticleId(0)
    setCurrentCommentId(0)
    if (!id) return
    if (id[0] === 'a') return setCurrentArticleId(Number(id.slice(1)))
    return setCurrentCommentId(Number(id.slice(1)))
  }
  function handleConfirmWindow () {
    // 關掉視窗前先把 articleId 歸零
    if (isConfirmOpen) {
      handleIdChange('')
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
  const articleContextValue: IArticleContext = {
    currentArticleId,
    currentCommentId,
    handleIdChange,
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
        <articleContext.Provider value={articleContextValue}>

          <main>{children}</main>
          {isConfirmOpen && <ConfirmWindow 
          artId={currentArticleId} 
          commentId={currentCommentId}
          handleDeleteArt={handleDeleteArt} 
          handleDeleteComment={handleDeleteComment}
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