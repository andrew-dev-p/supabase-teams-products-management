"use client";

import TeamPageLayout from "@/components/team-page-layout/team-page-layout";
import { useParams } from "next/navigation";
import { useQueryTeam } from "@/hooks/use-query-team";
import { useQueryProducts } from "@/hooks/use-query-products";
import { Package, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";
import { Status } from "@/lib/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import ProductsTable from "./products-table";

const TeamPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);

  const params = useParams();
  const slug = params.slug;

  const getTeamQuery = useQueryTeam(slug as string);

  const getProductsQuery = useQueryProducts(getTeamQuery.data?.id as string);

  return (
    <TeamPageLayout team={getTeamQuery.data}>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs">
                  Status
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter(Status.ACTIVE)}
                >
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter(Status.DRAFT)}>
                  Draft
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setStatusFilter(Status.DELETED)}
                >
                  Archived
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Select
          value={statusFilter || undefined}
          onValueChange={(value: Status) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px] -ml-1.5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {getProductsQuery.data && getProductsQuery.data.length > 0 ? (
        <div className="rounded-md border">
          <ProductsTable teamId={getTeamQuery.data?.id as string} />
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Package className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No products found</h3>
            <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
              {search
                ? "No products match your search criteria."
                : "Get started by creating a new product."}
            </p>
            <Link href={`/teams/${slug}/products/create`}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </TeamPageLayout>
  );
};

export default TeamPage;
