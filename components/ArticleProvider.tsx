import Navbar from './navbar'
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import ToTopButton from './toTopButton';
import ConfirmWindow from './confirmWindow';
import React, { useRef } from 'react';

import useSWRMutation from 'swr/mutation'
import { fetchDeleteArticle } from '../api_helpers/fetchers'
import { Iuser, Ihollow, Iarticle, Icomment, param, serverProps,  articleArg, deleteArg, successResult, likePayload, paramArg, rows, IArticleContext, IUIContext } from '../type-config';

export const articleContext = React.createContext<IArticleContext>({})
export const UIContext = React.createContext<IUIContext>({})


export default function ArticleProvider({ children }: PropsWithChildren) {
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false)
  const [refetchTrigger, setRefetchTrigger] = useState<boolean>(false)
  const [currentArticleId, setCurrentArticleId] = useState<number>(0)

  // fetcher 區
  //刪除文章
  const { trigger: deleteArtTrigger, isMutating: deleteArtIsMutating, data: deletedArtData, error: deletedArtError } = useSWRMutation<successResult, Error>(`article`, fetchDeleteArticle);

  // 編輯文章
  // const { trigger: addArtTrigger, isMutating: addArtIsMutating, data: addedArtData, error: addedArtError } = useSWRMutation<successResult, Error>(`article`, fetchAddArt, { onSuccess: (data: successResult) => { 
  //     const payload = data.payload as Iarticle
  //     const art = formattedArticles(currentUserId as number, [payload] as Iarticle[])[0]
  //     setNewArticle(art)
  // }});


  // function 區
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
  function handleRefetchTrigger () {
    setRefetchTrigger(false)
  }
  
  useEffect(() => {
    // 確定刪除文章成功才觸發重新 fetch 所有文章
    if (!deletedArtData) return
      setRefetchTrigger(true)
  }, [deletedArtData])

  // context value 區
  const articlecontextValue: IArticleContext = {
    currentArticleId,
    handleArticleIdChange,
    refetchTrigger,
    handleRefetchTrigger
  }
  const UIcontextValue: IUIContext = {
    handleConfirmWindow
  }

  return (
    <>
      <UIContext.Provider value={UIcontextValue}>
        <articleContext.Provider value={articlecontextValue}>

          <main>{children}</main>
          {isConfirmOpen && <ConfirmWindow id={currentArticleId} 
          handleDeleteArt={handleDeleteArt} 
          handleConfirmWindow={handleConfirmWindow}/>}

        </articleContext.Provider>
      </UIContext.Provider>
    </>
  )
}

// function artReducer (arts, action) {
//   switch (action.type) {
//     case 'get': {
//       return 'get'
//     }
//     case 'add': {
//       return 'add'
//     }
//     case 'edit': {
//       return 'add'
//     }
//     case 'delete': {
//       return deleteArtTrigger
//     }
//     default: {
//       throw Error('Unknown action: ' + action.type);
//     }
//   }
// }