import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function AppIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#030712',
          borderRadius: '18.75%',
        }}
      >
        <div
          style={{
            width: 380,
            height: 380,
            borderRadius: '50%',
            border: '20px solid #4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: 'white',
              fontSize: 128,
              fontWeight: 700,
              letterSpacing: '-2px',
            }}
          >
            CNT
          </span>
        </div>
      </div>
    ),
    { width: 512, height: 512 }
  )
}
