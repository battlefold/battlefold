import React from 'react'

export default function PresentationEmbed() {
  return (
    <div className="w-full h-full">
      <iframe 
        style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }} 
        width="100%" 
        height="100%" 
        src="https://embed.figma.com/slides/WFveoZi8u1DFekP5gT5LkO/BattleFold?node-id=1-269&embed-host=share" 
        allowFullScreen
      />
    </div>
  )
}