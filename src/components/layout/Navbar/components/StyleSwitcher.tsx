// src/components/StyleSwitcher.tsx
import React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useStyle } from '../../../../contexts/StyleContext'

const styles = [
  { name: 'Day', value: 'day', description: 'Suns out guns out' },
  { name: 'Night', value: 'night', description: '#FFFFFF you are blinding me!' },
  { name: 'System', value: 'system', description: 'Follow system settings' }
]

export const StyleSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { currentStyle, setStyle } = useStyle()

  // Determine which icon to show based on the currentStyle
  const getIcon = () => {
    if (currentStyle === 'day') return <Sun className="w-4 h-4" />
    if (currentStyle === 'night') return <Moon className="w-4 h-4" />
    if (currentStyle === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isSystemDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />
    }
    return <Sun className="w-4 h-4" /> // Default to day
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-sm btn-ghost"
        aria-label="Change style"
      >
        {getIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 p-2 bg-base-200 rounded-lg shadow-xl z-50">
          <div className="space-y-1">
            {styles.map((style) => (
              <button
                key={style.value}
                onClick={() => {
                  setStyle(style.value as any)
                  setIsOpen(false)
                }}
                className={`w-full p-2 text-left hover:bg-base-300 rounded-lg transition-colors flex flex-col
                  ${currentStyle === style.value ? 'bg-base-300' : ''}`}
              >
                <span className="font-medium">{style.name}</span>
                <span className="text-sm opacity-70">{style.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
