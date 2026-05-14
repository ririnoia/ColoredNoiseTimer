import { ImageResponse } from 'next/og'

export function GET() {
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
            width: 142,
            height: 142,
            borderRadius: '50%',
            border: '8px solid #4f46e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: 'white', fontSize: 46, fontWeight: 700 }}>
            CNT
          </span>
        </div>
      </div>
    ),
    { width: 192, height: 192 }
  )
}
