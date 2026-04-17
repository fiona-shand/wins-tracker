import {
  CheckCircleIcon,
  HeartIcon,
  StarIcon,
} from '@heroicons/react/24/outline'
import { NavLink } from 'react-router-dom'

export function TabBar() {
  return (
    <nav className="tab-bar" aria-label="Main">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `tab-bar-link${isActive ? ' active' : ''}`}
      >
        <CheckCircleIcon className="tab-bar-ico" aria-hidden />
        <span>Today</span>
      </NavLink>
      <NavLink
        to="/buddy"
        className={({ isActive }) => `tab-bar-link${isActive ? ' active' : ''}`}
      >
        <HeartIcon className="tab-bar-ico" aria-hidden />
        <span>Buddy</span>
      </NavLink>
      <NavLink
        to="/calendar"
        className={({ isActive }) => `tab-bar-link${isActive ? ' active' : ''}`}
      >
        <StarIcon className="tab-bar-ico" aria-hidden />
        <span>Stars</span>
      </NavLink>
    </nav>
  )
}
