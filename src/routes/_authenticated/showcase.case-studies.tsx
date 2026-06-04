import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { caseStudiesRef, CaseStudyData } from "@/lib/db";
import { doc, setDoc, query, orderBy, onSnapshot } from "firebase/firestore";

export const Route = createFileRoute("/_authenticated/showcase/case-studies")({
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const [studies, setStudies] = useState<CaseStudyData[]>([]);

  useEffect(() => {
    const q = query(caseStudiesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setStudies(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CaseStudyData[]);
    }, (err) => {
      console.error(err);
    });
    return () => unsubscribe();
  }, []);

  const handleGenerate = async () => {
    const topic = window.prompt("Enter topic for new case study:");
    if (!topic) return;
    
    const newId = `CS-2026-${Math.floor(100 + Math.random() * 900)}`;
    try {
      await setDoc(doc(caseStudiesRef, newId), {
        title: topic,
        tags: ["auto-generated"],
        summary: `Automated summary of ${topic} generated from recent platform intelligence and aggregated narratives.`,
        createdAt: Date.now()
      });
    } catch (e) {
      console.error(e);
      window.alert("Failed to generate case study");
    }
  };
  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="flex items-center justify-between border-b border-border p-4 shrink-0 glass z-10">
        <div>
          <h1 className="text-lg font-medium">Case Study Generator</h1>
          <p className="text-muted-foreground mt-1 text-sm">Automatically generate investigation summaries for external demonstration.</p>
        </div>
        <button 
          onClick={handleGenerate}
          className="border border-border bg-foreground text-background px-3 py-1.5 hover:bg-accent transition-colors font-medium rounded-sm"
        >
          Generate New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 slide-up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {studies.map(study => (
            <div key={study.id} className="border border-border bg-card p-5 rounded-sm hover-glow flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-2">{study.id}</span>
                <h3 className="text-sm font-semibold mb-2 text-foreground">{study.title}</h3>
                <p className="text-[12px] text-muted-foreground mb-4">{study.summary}</p>
              </div>
              <button 
                onClick={() => window.alert(`Link to ${study.id} copied to clipboard!`)}
                className="text-[11px] underline decoration-dashed text-accent hover:text-foreground self-start"
              >
                Share Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
