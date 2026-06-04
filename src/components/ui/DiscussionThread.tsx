import { useState } from "react";

type Comment = {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isSystemEvent?: boolean;
};

export function DiscussionThread({ comments: initialComments }: { comments: Comment[] }) {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(initialComments);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {comments.map((c) => (
          <div key={c.id} className={`flex gap-3 ${c.isSystemEvent ? 'opacity-70' : ''}`}>
            {!c.isSystemEvent && (
              <div className="w-6 h-6 rounded-sm bg-secondary flex items-center justify-center text-[10px] uppercase font-bold shrink-0">
                {c.author.substring(0, 2)}
              </div>
            )}
            <div className={`flex flex-col ${c.isSystemEvent ? 'border-l-2 border-accent pl-2' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium">{c.author}</span>
                <span className="text-[10px] font-mono text-muted-foreground">{c.timestamp}</span>
              </div>
              <p className="text-[12px] mt-0.5 text-foreground leading-relaxed whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border shrink-0">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment... (Type @ to mention)"
          className="w-full bg-background border border-border p-2 text-[12px] min-h-[60px] focus:outline-none focus:border-accent resize-none"
        />
        <div className="flex justify-end mt-2">
          <button 
            onClick={() => {
              if (newComment) {
                setComments([...comments, {
                  id: String(Date.now()),
                  author: "Current User",
                  content: newComment,
                  timestamp: "Just now",
                  isSystemEvent: false
                }]);
                setNewComment('');
              }
            }}
            className="bg-foreground text-background text-[11px] font-medium px-4 py-1.5 hover:bg-accent transition-colors"
          >
            Post Reply
          </button>
        </div>
      </div>
    </div>
  );
}
