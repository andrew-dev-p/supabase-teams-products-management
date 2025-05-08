"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/lib/entities";
import { statusToColorsMap } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onDelete: () => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  return (
    <Card className="overflow-hidden gap-0">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={product.picture || "/placeholder.svg"}
            alt={product.title}
            fill
            className="object-cover"
          />
          <div className="absolute right-2 top-2">
            <Badge
              className={`${
                statusToColorsMap[product.status]
              } text-white hover:${statusToColorsMap[product.status]}`}
            >
              {product.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <Link href={`/products/${product.id}`} className="hover:underline">
              <h3 className="font-semibold">{product.title}</h3>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <Link href={`/products/${product.id}`}>
                  <DropdownMenuItem>View</DropdownMenuItem>
                </Link>
                <Link href={`/products/${product.id}/edit`}>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
