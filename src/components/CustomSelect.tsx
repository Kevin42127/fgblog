import { useState, useRef, useEffect } from 'react'
import './CustomSelect.css'

interface Option {
  value: string
  label: string
}

interface CustomSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  required?: boolean
}

export default function CustomSelect({
  id,
  value,
  onChange,
  options,
  placeholder = '選擇選項',
  required = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const selectRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && dropdownRef.current && highlightedIndex >= 0) {
      const highlightedElement = dropdownRef.current.children[highlightedIndex] as HTMLElement
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [isOpen, highlightedIndex])

  const handleToggle = () => {
    setIsOpen(!isOpen)
    setHighlightedIndex(-1)
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (isOpen && highlightedIndex >= 0) {
        handleSelect(options[highlightedIndex].value)
      } else {
        handleToggle()
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setHighlightedIndex(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      } else {
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : prev
        )
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen) {
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0)
      }
    }
  }

  return (
    <div 
      ref={selectRef}
      className={`custom-select ${isOpen ? 'open' : ''} ${!value ? 'placeholder' : ''}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div 
        className="select-trigger"
        onClick={handleToggle}
        role="button"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        id={id}
      >
        <span className="select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="select-arrow material-icons">
          {isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
        </span>
      </div>
      {isOpen && (
        <div 
          ref={dropdownRef}
          className="select-dropdown"
          role="listbox"
        >
          {options.length === 0 ? (
            <div className="select-option empty">沒有選項</div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.value}
                className={`select-option ${value === option.value ? 'selected' : ''} ${index === highlightedIndex ? 'highlighted' : ''}`}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={value === option.value}
              >
                {option.label}
                {value === option.value && (
                  <span className="select-check material-icons">check</span>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {required && !value && (
        <input
          type="text"
          tabIndex={-1}
          required
          className="select-required-input"
          aria-hidden="true"
          readOnly
          value=""
          onFocus={(e) => e.target.blur()}
        />
      )}
    </div>
  )
}

