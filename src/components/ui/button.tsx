import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-amfit-primary text-amfit-text-on-dark hover:bg-amfit-primary-hover transition-all duration-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-amfit-border bg-amfit-surface hover:bg-amfit-secondary text-amfit-text-on-light transition-all duration-200",
        secondary:
          "bg-amfit-secondary text-amfit-text-on-light hover:bg-amfit-secondary-hover border border-amfit-border transition-all duration-200",
        ghost: "hover:bg-amfit-secondary text-amfit-text-primary transition-all duration-200",
        link: "text-amfit-text-primary underline-offset-4 hover:underline",
        // Specific AM Fit variants
        "amfit-primary": "bg-amfit-primary text-amfit-text-on-dark hover:bg-amfit-primary-hover hover:shadow-medium hover:scale-[1.02] font-semibold transition-all duration-300",
        "amfit-secondary": "bg-amfit-secondary text-amfit-text-on-light border border-amfit-border hover:bg-amfit-secondary-hover hover:shadow-medium hover:scale-[1.02] font-semibold transition-all duration-300",
        "amfit-orange": "bg-amfit-orange text-white hover:bg-amfit-orange-hover hover:shadow-orange-glow hover:scale-[1.02] font-semibold transition-all duration-300",
        "amfit-white": "bg-amfit-secondary text-amfit-text-on-light border border-amfit-border hover:bg-amfit-secondary-hover hover:shadow-medium hover:scale-[1.02] font-semibold transition-all duration-300 backdrop-blur-medium",
        "amfit-black": "bg-amfit-primary text-amfit-text-on-dark hover:bg-amfit-primary-hover hover:shadow-black hover:scale-[1.02] font-semibold transition-all duration-300 backdrop-blur-medium",
        "amfit-accent": "bg-amfit-orange text-white hover:bg-amfit-orange-hover hover:shadow-orange-glow hover:scale-[1.02] font-semibold transition-all duration-300",
        // Deprecated variants (keeping for compatibility)
        amfit: "bg-gradient-primary text-white hover:shadow-medium hover:scale-[1.02] font-semibold tracking-wide transition-all duration-200",
        elegant: "bg-white border border-border text-foreground hover:shadow-medium hover:bg-muted transition-all duration-200 font-medium",
        modern: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-all duration-200 shadow-subtle hover:shadow-medium",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm rounded-md",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        amfit: "h-14 px-6 py-4 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
