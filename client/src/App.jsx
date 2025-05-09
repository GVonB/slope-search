import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Dialog } from "@components/ui/dialog"

function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Slope Search 🏔️</h1>
      <Button className="mb-4">Check Ski Areas</Button>
      <Button variant="outline">Check Runs</Button>
    </div>
  )
}

export default App