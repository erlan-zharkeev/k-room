import './style.scss'
import parse from 'html-react-parser'

interface CollapseItem {
  id: string
  title: string
  content: string
}

interface AppCollapseProps {
  items: CollapseItem[]
}

export const AppCollapse: React.FC<AppCollapseProps> = ({ items }) => {
  return (
    <div className="app-collapse">
      {items.map((item, idx) => (
        <details key={idx} className="app-collapse__element">
          <summary className="app-collapse__element-title">{item.title}</summary>
          <div className="app-collapse__element-content">{parse(item.content)}</div>
        </details>
      ))}
    </div>
  )
}
