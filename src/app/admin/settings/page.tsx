export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900 mb-8">Einstellungen</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 mb-4">Umgebungsvariablen Status</h2>
            <div className="space-y-3">
              {[
                { key: 'DATABASE_URL', val: process.env.DATABASE_URL },
                { key: 'NEXTAUTH_SECRET', val: process.env.NEXTAUTH_SECRET },
                { key: 'STRIPE_SECRET_KEY', val: process.env.STRIPE_SECRET_KEY },
                { key: 'RESEND_API_KEY', val: process.env.RESEND_API_KEY },
              ].map(({ key, val }) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="font-mono text-sm text-gray-700">{key}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    val && !val.includes('placeholder') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {val && !val.includes('placeholder') ? '✓ Konfiguriert' : '⚠ Placeholder'}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">Hinweis</p>
            <p>Ersetze die Placeholder-Werte in <code className="font-mono bg-blue-100 px-1 rounded">.env.local</code> mit echten API-Keys für die vollständige Funktionalität.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
