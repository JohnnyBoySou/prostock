import { Main, Row, colors, Title, Column, Label, useQuery, Loader } from "@/ui";
import { singleNotify } from "@/api/notify";

export default function NotifyShowScreen({ route }) {

    const id = route.params?.id;
    const { data, isLoading, refetch } = useQuery({
        queryKey: [`single notify ${id}`, ],
        queryFn: async () => {
            const res = await singleNotify(id);
            return res;
        },
        enable: !!id
    })
    return (
        <Main>
            {isLoading ? <Loader size={24} color={colors.color.primary} /> : <Card item={data} />}
        </Main>)
}
const Card = ({ item }) => {
    const { type, title, publish_date, date, desc } = item;
    return (
        <Column  mv={12} mh={26}>
            <Row pv={20} justify="space-between" ph={20} mv={8} style={{ backgroundColor: '#FFF', borderRadius: 8 }}>
                <Column gv={6}>
                    <Title size={20} fontFamily='Font_Medium'>{title?.length > 16 ? title?.slice(0, 16) + '...' : title}</Title>
                    <Label>{type} • {date} • {publish_date}</Label>
                    <Label>{desc}</Label>
                </Column>
            </Row>
        </Column>
    )
}