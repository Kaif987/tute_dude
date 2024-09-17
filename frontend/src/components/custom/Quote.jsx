export function QuoteComponent() {
  return (
    <div className="hidden lg:flex items-center justify-center bg-muted p-6 xl:p-10">
      <div className="mx-auto max-w-[500px] space-y-4">
        <blockquote className="text-lg font-semibold leading-snug">
          &ldquo; Great things happen when we come together. Start the
          conversation, share your story, and connect with the world&rdquo;
        </blockquote>
        <div className="font-semibold">John Doe</div>
        <div className="text-sm text-muted-foreground">Pinecone, CEO</div>
      </div>
    </div>
  );
}
