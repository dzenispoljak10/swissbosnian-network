export type BlockType = 'header' | 'text' | 'image' | 'button' | 'divider' | 'spacer' | 'footer'

export interface Block {
  id: string
  type: BlockType
  data: Record<string, unknown>
}

export interface GlobalStyles {
  fontFamily: string
  backgroundColor: string
  contentBgColor: string
  primaryColor: string
  maxWidth: number
}

export const defaultGlobalStyles: GlobalStyles = {
  fontFamily: 'Arial, sans-serif',
  backgroundColor: '#f4f4f4',
  contentBgColor: '#ffffff',
  primaryColor: '#0D1F6E',
  maxWidth: 600,
}

export const defaultBlocks: Block[] = [
  {
    id: 'block-header-default',
    type: 'header',
    data: { title: 'Swiss Bosnian Network', subtitle: '', bgColor: '#0D1F6E', textColor: '#ffffff' },
  },
  {
    id: 'block-text-default',
    type: 'text',
    data: { content: '<p>Sehr geehrte Damen und Herren,</p><p>wir freuen uns, Ihnen unseren neuesten Newsletter zu präsentieren.</p>', align: 'left' },
  },
  {
    id: 'block-footer-default',
    type: 'footer',
    data: { text: 'Swiss Bosnian Network | info@swissbosnian-network.ch', address: 'Schweiz', unsubscribeText: 'Abonnement kündigen' },
  },
]

export function createBlock(type: BlockType): Block {
  const id = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  const defaults: Record<BlockType, Record<string, unknown>> = {
    header: { title: 'Newsletter Titel', subtitle: '', bgColor: '#0D1F6E', textColor: '#ffffff' },
    text: { content: '<p>Ihr Text hier...</p>', align: 'left' },
    image: { src: '', alt: '', link: '', width: '100%' },
    button: { text: 'Mehr erfahren', url: '#', bgColor: '#0D1F6E', textColor: '#ffffff', align: 'center', size: 'medium' },
    divider: { color: '#E5E7EB', thickness: 1, spacing: 16 },
    spacer: { height: 32 },
    footer: { text: 'Swiss Bosnian Network | info@swissbosnian-network.ch', address: 'Schweiz', unsubscribeText: 'Abonnement kündigen' },
  }
  return { id, type, data: defaults[type] }
}

function renderBlock(block: Block, primaryColor: string): string {
  const d = block.data
  switch (block.type) {
    case 'header': {
      const bgColor = (d.bgColor as string) || '#0D1F6E'
      const textColor = (d.textColor as string) || '#ffffff'
      const title = (d.title as string) || ''
      const subtitle = (d.subtitle as string) || ''
      return `<tr><td style="background:${bgColor};padding:32px 40px;text-align:center;">
        <h1 style="margin:0;color:${textColor};font-size:24px;font-weight:800;font-family:Arial,sans-serif;line-height:1.3;">${title}</h1>
        ${subtitle ? `<p style="margin:8px 0 0;color:${textColor};opacity:0.85;font-size:15px;font-family:Arial,sans-serif;">${subtitle}</p>` : ''}
      </td></tr>`
    }
    case 'text': {
      const content = (d.content as string) || ''
      const align = (d.align as string) || 'left'
      return `<tr><td style="padding:24px 40px;text-align:${align};color:#374151;font-size:15px;line-height:1.7;font-family:Arial,sans-serif;">
        ${content}
      </td></tr>`
    }
    case 'image': {
      const src = (d.src as string) || ''
      if (!src) return ''
      const alt = (d.alt as string) || ''
      const link = (d.link as string) || ''
      const width = (d.width as string) || '100%'
      const img = `<img src="${src}" alt="${alt}" width="${width}" style="max-width:100%;height:auto;display:block;margin:0 auto;border-radius:6px;" />`
      return `<tr><td style="padding:16px 40px;text-align:center;">
        ${link ? `<a href="${link}" style="display:inline-block;">${img}</a>` : img}
      </td></tr>`
    }
    case 'button': {
      const text = (d.text as string) || 'Mehr erfahren'
      const url = (d.url as string) || '#'
      const bgColor = (d.bgColor as string) || primaryColor
      const textColor = (d.textColor as string) || '#ffffff'
      const align = (d.align as string) || 'center'
      const size = (d.size as string) || 'medium'
      const padding = size === 'small' ? '10px 24px' : size === 'large' ? '18px 40px' : '14px 32px'
      const fontSize = size === 'small' ? '13px' : size === 'large' ? '17px' : '15px'
      return `<tr><td style="padding:16px 40px;text-align:${align};">
        <a href="${url}" style="display:inline-block;background:${bgColor};color:${textColor};text-decoration:none;border-radius:8px;padding:${padding};font-size:${fontSize};font-weight:600;font-family:Arial,sans-serif;">${text}</a>
      </td></tr>`
    }
    case 'divider': {
      const color = (d.color as string) || '#E5E7EB'
      const thickness = (d.thickness as number) || 1
      const spacing = (d.spacing as number) || 16
      return `<tr><td style="padding:${spacing}px 40px;">
        <hr style="border:none;border-top:${thickness}px solid ${color};margin:0;" />
      </td></tr>`
    }
    case 'spacer': {
      const height = (d.height as number) || 32
      return `<tr><td style="height:${height}px;line-height:${height}px;font-size:1px;">&nbsp;</td></tr>`
    }
    case 'footer': {
      const text = (d.text as string) || ''
      const address = (d.address as string) || ''
      const unsubscribeText = (d.unsubscribeText as string) || 'Abonnement kündigen'
      return `<tr><td style="background:#F9FAFB;padding:24px 40px;text-align:center;border-top:1px solid #E5E7EB;">
        ${text ? `<p style="margin:0 0 4px;color:#6B7280;font-size:13px;font-family:Arial,sans-serif;">${text}</p>` : ''}
        ${address ? `<p style="margin:0 0 8px;color:#9CA3AF;font-size:12px;font-family:Arial,sans-serif;">${address}</p>` : ''}
        <a href="{{unsubscribe_url}}" style="color:#9CA3AF;font-size:12px;font-family:Arial,sans-serif;text-decoration:underline;">${unsubscribeText}</a>
      </td></tr>`
    }
    default:
      return ''
  }
}

export function renderNewsletter(
  blocks: Block[],
  globalStyles: GlobalStyles,
  meta: { subject: string; previewText?: string }
): string {
  const gs = { ...defaultGlobalStyles, ...globalStyles }
  const blocksHtml = blocks.map(b => renderBlock(b, gs.primaryColor)).filter(Boolean).join('\n')

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.subject || 'Newsletter'}</title>
</head>
<body style="margin:0;padding:0;background-color:${gs.backgroundColor};font-family:${gs.fontFamily};">
  ${meta.previewText ? `<div style="display:none;font-size:1px;color:${gs.backgroundColor};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${meta.previewText}&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${gs.backgroundColor};">
    <tr><td align="center" style="padding:20px 16px;">
      <table role="presentation" width="${gs.maxWidth}" cellpadding="0" cellspacing="0" style="max-width:${gs.maxWidth}px;width:100%;background-color:${gs.contentBgColor};border-radius:8px;overflow:hidden;">
        ${blocksHtml}
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
