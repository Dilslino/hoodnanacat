import { HUD } from "@/components/ui/HUD";
import { VisualFallback } from "@/components/ui/VisualFallback";
import { SceneCanvas } from "@/components/scene/SceneCanvasLoader";

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-[#F8F5EF]">
      <VisualFallback />
      <SceneCanvas />
      <HUD />
    </main>
  );
}
