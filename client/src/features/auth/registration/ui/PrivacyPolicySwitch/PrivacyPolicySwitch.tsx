import './style.scss'
import { RouteNames } from 'common-types'

export const PrivacyPolicySwitch = () => {
  return (
    <div className="privacy-policy-switch">
      <span className="privacy-policy-switch__text">
        I have read and agree{' '}
        <a className="link" target="_blank" href={RouteNames.PrivacyPolicy} rel="noreferrer">
          privacy policy
        </a>
      </span>
    </div>
  )
}
