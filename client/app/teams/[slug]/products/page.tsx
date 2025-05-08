"use client";

import TeamPageLayout from "@/components/team-page-layout/team-page-layout";
import { useParams } from "next/navigation";
import { useQueryTeam } from "@/hooks/use-query-team";
import { useQueryProducts } from "@/hooks/use-query-products";
import { Search } from "lucide-react";
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
import { Status } from "@/lib/entities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";
import ProductsTable from "./products-table";

const TeamPage = () => {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");

  const params = useParams();
  const slug = params.slug;

  const getTeamQuery = useQueryTeam(slug as string);

  const getProductsQuery = useQueryProducts(
    getTeamQuery.data?.id as string,
    searchQuery,
    statusFilter
  );

  console.log("component: ", searchQuery);

  return (
    <TeamPageLayout team={getTeamQuery.data}>
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8 bg-background rounded-r-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              className="rounded-l-none"
              variant="outline"
              size="icon"
              onClick={() => setSearchQuery(search)}
            >
              <Search />
            </Button>
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
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
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
                  Deleted
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Select
          value={statusFilter}
          onValueChange={(value: Status | "all") => setStatusFilter(value)}
        >
          <SelectTrigger className="w-[180px] -ml-1.5 bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>All Statuses</SelectItem>
            <SelectItem value={Status.ACTIVE}>Active</SelectItem>
            <SelectItem value={Status.DRAFT}>Draft</SelectItem>
            <SelectItem value={Status.DELETED}>Deleted</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <ProductsTable
          data={getProductsQuery.data || []}
          teamId={getTeamQuery.data?.id as string}
        />
      </div>
      {getProductsQuery.isPending && <>TODO: Skeleton</>}
    </TeamPageLayout>
  );
};

export default TeamPage;
