import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface StoryboardPromptProps {
  onGenerate: (prompt: string) => void
  isLoading: boolean
  hasSavedSequences: boolean
  progress: number
}

const StoryboardPrompt: React.FC<StoryboardPromptProps> = ({ onGenerate, isLoading, hasSavedSequences, progress }) => {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim()) {
      onGenerate(prompt.trim())
      setPrompt('')
    }
  }

  const gradientStyle = {
    background: `linear-gradient(to right, 
      hsl(0, 0%, 20%) 0%, 
      hsl(0, 0%, 80%) 100%)`,
    width: `${progress}%`,
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 w-full"
      layout
      transition={{ duration: 0.5 }}
    >
      {isLoading ? (
        <div className="flex-grow p-2 rounded-md bg-input text-foreground border border-border relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-300 ease-in-out"
            style={gradientStyle}
          />
          <div className="relative z-10 text-center">Generating sequence... {progress}%</div>
        </div>
      ) : (
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={hasSavedSequences ? "Describe another sequence..." : "Describe your storyboard sequence..."}
          className="flex-grow p-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
        />
      )}
      <Button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className={`px-4 py-2 rounded-md ${
          isLoading || !prompt.trim()
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90'
        } transition-colors duration-200 shadow-md whitespace-nowrap`}
      >
        {isLoading ? 'Generating...' : 'Generate'}
      </Button>
    </motion.form>
  )
}

export default StoryboardPrompt