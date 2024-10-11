import React from 'react'
import Head from 'next/head'

export default function DemoPage() {
  return (
    <>
      <Head>
        <title>BattleFold Demo</title>
        <meta name="description" content="BattleFold presentation and demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-screen bg-black">
        {/* Presentation iframe */}
        <div className="w-[70%] p-4">
          <iframe 
            style={{ border: '1px solid rgba(255, 255, 255, 0.1)' }}
            width="100%" 
            height="100%" 
            src="https://embed.figma.com/deck/WFveoZi8u1DFekP5gT5LkO/BattleFold?node-id=1-269&node-type=slide&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share" 
            allowFullScreen
          />
        </div>
        
        {/* App demo iframe */}
        <div className="w-[30%] p-4">
          <iframe
            src="/"
            width="100%"
            height="100%"
            style={{ border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '20px' }}
          />
        </div>
      </div>
    </>
  )
}