import { AdminEndpoints } from 'common-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { UIButton } from 'src/components/ui'
import { useTypedSelector } from 'src/hooks'
import { useApi } from 'src/services'
import { AppDispatch, closeModal } from 'src/store'

export const DBClearConfirmPopup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { modalData } = useTypedSelector((state) => state.system)
  const [loader, setLoader] = useState(false)
  const { doRequest } = useApi()

  const closeModalHandler = () => {
    dispatch(closeModal())
  }

  const dbClearLoaderHandler = async () => {
    setLoader(true)
    await doRequest('post', AdminEndpoints.DBClear)
    if (modalData.actions && modalData.actions.getData) {
      await modalData.actions.getData()
    }
    setLoader(false)
    dispatch(closeModal())
  }

  return (
    <div className="clear-db-confirm-popup">
      <p className="paragraph-text paragraph-text--secondary paragraph-text--md">
        Are you shure want to clear data base?
      </p>
      <div className="clear-db-confirm-popup__actions">
        <UIButton text="Clear" border="common-border" fill onClick={dbClearLoaderHandler} loading={loader} />
        <UIButton text="Cancel" border="common-border" fill onClick={closeModalHandler} />
      </div>
    </div>
  )
}
