'use client'

import dynamic from 'next/dynamic'
import Grid from './Grid'
import Blurs from './Blurs'

const ThreeGraphBG = dynamic(() => import('../Home/ThreeGraphBG'), { ssr: false })

export default function SiteBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#ededed] dark:bg-black z-0 overflow-hidden">
      <div className="absolute inset-0">
        <ThreeGraphBG nodeCount={80} />
      </div>
             <Grid />    

      <div className="fixed inset-0 pointer-events-none">
 
        <Blurs />
      </div>
    </div>
  )
}
