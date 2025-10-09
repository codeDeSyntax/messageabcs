import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  author: string
  category: string
  readTime: number
  publishedAt: string
  image?: string
}

interface BlogCardProps {
  post: BlogPost
  onClick?: () => void
}

export function BlogCard({ post, onClick }: BlogCardProps) {
  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-border bg-card"
      onClick={onClick}
    >
      {post.image && (
        <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-foreground line-clamp-2 leading-snug">
          {post.title}
        </h3>
        
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{post.readTime} min read</span>
          </div>
        </div>
      </div>
    </Card>
  )
}