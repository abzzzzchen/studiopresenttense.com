import { Text } from "@/components/Text";
import type { Project } from "@/types/home";

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
              <Text className="col-span-8">{project.project}</Text>
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
              <Text className="col-span-8">{project.with}</Text>
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
              <Text className="col-span-2">{project.project}</Text>
              <Text className="col-span-4">{project.services}</Text>
              <Text className="col-span-2">{project.sector}</Text>
              <Text className="col-span-6">{project.inPractice}</Text>
              <Text className="col-span-1 text-nowrap">
                {project.with || " "}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
