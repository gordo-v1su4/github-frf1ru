import { useState, useEffect } from 'react'
import StoryboardPrompt from './components/StoryboardPrompt'
import StoryboardSequence from './components/StoryboardSequence'
import { generateImages } from './utils/falAi'
import { AnimatePresence, motion } from 'framer-motion'

function App() {
  const [sequences, setSequences] = useState<string[][]>([])
  const [currentSequence, setCurrentSequence] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())

  useEffect(() => {
    console.log('App component mounted');
  }, []);

  const handleGenerateSequence = async (prompt: string) => {
    setIsLoading(true)
    setProgress(0)
    try {
      const newSequence = await generateImages(prompt)
      setCurrentSequence(newSequence)
    } catch (error) {
      console.error('Error generating images:', error)
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSequence = () => {
    if (currentSequence.length > 0) {
      setSequences([currentSequence, ...sequences])
      setCurrentSequence([])
    }
  }

  const handleDeleteCurrentSequence = () => {
    setCurrentSequence([])
  }

  const handleDeleteSavedSequence = (index: number) => {
    setSequences(sequences.filter((_, i) => i !== index))
  }

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(imageUrl)) {
        newSet.delete(imageUrl)
      } else {
        newSet.add(imageUrl)
      }
      return newSet
    })
  }

  const handleUpdateImage = (oldImageUrl: string, newImageUrl: string) => {
    setCurrentSequence(prev => prev.map(img => img === oldImageUrl ? newImageUrl : img));
    setSequences(prev => prev.map(seq => seq.map(img => img === oldImageUrl ? newImageUrl : img)));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 p-4">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl tracking-tight mb-8 text-primary uppercase">
          <span className="italic font-bold">NERATE</span>{' '}
          <span className="font-normal text-custom-gray">SEQUENCE</span>
        </h1>
        <div className="w-full max-w-none mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md p-6 mb-8">
          <StoryboardPrompt 
            onGenerate={handleGenerateSequence} 
            isLoading={isLoading}
            hasSavedSequences={sequences.length > 0}
            progress={progress}
          />
        </div>
        <AnimatePresence>
          {currentSequence.length > 0 && (
            <motion.div
              key="current-sequence"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <StoryboardSequence 
                images={currentSequence} 
                onDelete={handleDeleteCurrentSequence}
                onSave={handleSaveSequence}
                showControls={true}
                selectedImages={selectedImages}
                toggleImageSelection={toggleImageSelection}
                onUpdateImage={handleUpdateImage}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {sequences.map((sequence, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <StoryboardSequence 
                images={sequence} 
                onDelete={() => handleDeleteSavedSequence(index)}
                showControls={true}
                selectedImages={selectedImages}
                toggleImageSelection={toggleImageSelection}
                onUpdateImage={handleUpdateImage}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App