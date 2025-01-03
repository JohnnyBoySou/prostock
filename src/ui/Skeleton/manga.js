import { Column, Skeleton, Row } from "@/ui";
export default function SingleMangaSkeleton() {
  return (
    <Column mv={50}>
      <Column gv={8} mh={26}>
        <Skeleton h={230} w={300} />
        <Skeleton h={30} w={300} />
        <Skeleton h={30} w={200} />
      </Column>
      <Column gv={6} mh={26} mv={20}>
        <Skeleton h={20} w={300} />
        <Skeleton h={20} w={300} />
        <Skeleton h={20} w={200} />
      </Column>
      <Row gh={8} mh={26} >
        <Skeleton h={40} w={100} r={100} />
        <Skeleton h={40} w={100} r={100} />
        <Skeleton h={40} w={100} r={100} />
      </Row>
      <Row mh={26} gh={12} mv={12}>
        <Skeleton h={60} w={80} r={8} />
        <Skeleton h={60} w={80} r={8} />
        <Skeleton h={60} w={80} r={8} />
        <Skeleton h={60} w={80} r={8} />
      </Row>
    </Column>
  );
};
