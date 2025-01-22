import { AdminEndpoints } from 'common-types'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { UIButton } from 'src/components/ui'
import { useTypedSelector } from 'src/hooks'
import { useApi } from 'src/services'
import { AppDispatch, closeModal } from 'src/store'

export const ApplyBasicFixturesPopup = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { modalData } = useTypedSelector((state) => state.system)
  const [loader, setLoader] = useState(false)
  const { doRequest } = useApi()

  const closeModalHandler = () => {
    dispatch(closeModal())
  }

  const applyBasicFixtures = async () => {
    setLoader(true)
    await doRequest('patch', AdminEndpoints.APPLY_FIXTURES)
    if (modalData.actions && modalData.actions.getData) {
      await modalData.actions.getData()
    }
    setLoader(false)
    dispatch(closeModal())
  }

  return (
    <div className="apply-basic-fixtures-popup">
      <p className="paragraph-text paragraph-text--secondary paragraph-text--md">Are you shure want to apply basic fixtures?</p>
      <div className="apply-basic-fixtures-popup__actions">
        <UIButton text="Apply" border="common-border" fill onClick={applyBasicFixtures} loading={loader} />
        <UIButton text="Cancel" border="common-border" fill onClick={closeModalHandler} />
      </div>
    </div>
  )
}
