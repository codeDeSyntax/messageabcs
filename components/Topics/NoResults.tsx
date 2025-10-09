export function NoResults() {
  return (
    <div className="text-center py-12">
      <div className="text-foreground mb-2">No topics found</div>
      <div className="text-sm text-muted-foreground">
        Try adjusting your search terms
      </div>
    </div>
  );
}
