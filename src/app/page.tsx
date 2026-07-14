import { HUD } from "@/components/ui/HUD";
import { SceneCanvas } from "@/components/scene/SceneCanvasLoader";

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-[#F8F5EF]">
      <SceneCanvas />
      <HUD />
    </main>
  );
}
