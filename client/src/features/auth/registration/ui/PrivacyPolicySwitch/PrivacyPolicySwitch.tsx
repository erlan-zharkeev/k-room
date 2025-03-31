import './style.scss'
import { RouteNamesEnum } from 'common-types'

export const PrivacyPolicySwitch = () => {
  return (
    <div className="privacy-policy-switch">
      <span className="privacy-policy-switch__text">
        I have read and agree{' '}
        <a className="link" target="_blank" href={RouteNamesEnum.PrivacyPolicy} rel="noreferrer">
          privacy policy
        </a>
      </span>
    </div>
  )
}
