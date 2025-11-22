import React, { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    mermaid: any;
  }
}

interface MermaidProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidProps> = ({ chart }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const renderChart = async () => {
      setLoading(true);
      setError(false);
      try {
        // Wait for window.mermaid to load if not ready
        let attempts = 0;
        while (!window.mermaid && attempts < 10) {
          await new Promise(r => setTimeout(r, 200));
          attempts++;
        }

        if (!window.mermaid) {
          throw new Error("Mermaid not loaded");
        }

        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await window.mermaid.render(id, chart);
        setSvg(svg);
      } catch (err) {
        console.error("Mermaid render error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  if (error) return <div className="text-red-400 text-xs p-4 border border-red-200 rounded bg-red-50">No se pudo generar el diagrama. Verifique los datos.</div>;

  return (
    <div className="w-full overflow-x-auto bg-white p-4 rounded-lg border border-slate-100 min-h-[200px] flex items-center justify-center">
      {loading ? (
        <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
      ) : (
        <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
};

export default MermaidDiagram;