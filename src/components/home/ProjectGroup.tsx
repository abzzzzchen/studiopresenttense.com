import type { ReactNode } from "react";

import { Text } from "@/components/Text";
import type { Project } from "@/types/home";

// Wrap content in an external link when an href is present, otherwise render it
// as-is. Keeps the title/collaborator cells link-aware without duplicating the
// anchor markup.
function MaybeLink({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export function ProjectGroup({
  label,
  projects,
}: {
  label: string;
  projects: Project[];
}) {
  return (
    <div>
      {/* mobile: one stacked card per project */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div>
          <Text>{label}</Text>
          <Text>Services</Text>
          <Text>Sector</Text>
          <Text>In Practice</Text>
          <Text>With</Text>
        </div>
        {projects.map((project, i) => (
          <div key={i} className="pl-8">
            <div className="grid grid-cols-12">
              <Text className="col-span-8">
                <MaybeLink href={project.projectLink}>
                  {project.project}
                </MaybeLink>
              </Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">{project.services}</Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">{project.sector}</Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">{project.inPractice}</Text>
            </div>
            <div className="grid grid-cols-12">
              <Text className="col-span-8">
                <MaybeLink href={project.withLink}>{project.with}</MaybeLink>
              </Text>
            </div>
          </div>
        ))}
      </div>

      {/* desktop: row-major, hidden on mobile */}
      <div className="hidden flex-col sm:flex">
        {/* header row */}
        <div className="grid grid-cols-16 gap-5 mb-2">
          <Text className="col-span-2">{label}</Text>
          <Text className="col-span-4">Services</Text>
          <Text className="col-span-2">Sector</Text>
          <Text className="col-span-6">In Practice</Text>
          <Text className="col-span-1">With</Text>
        </div>
        {/* one grid row per project */}
        <div className="flex flex-col gap-[2px]">
          {projects.map((project, i) => (
            <div key={i} className="grid grid-cols-16 gap-5">
              <Text className="col-span-2">
                <MaybeLink href={project.projectLink}>
                  {project.project}
                </MaybeLink>
              </Text>
              <Text className="col-span-4">{project.services}</Text>
              <Text className="col-span-2">{project.sector}</Text>
              <Text className="col-span-6">{project.inPractice}</Text>
              <Text className="col-span-1 text-nowrap">
                <MaybeLink href={project.withLink}>
                  {project.with || " "}
                </MaybeLink>
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
