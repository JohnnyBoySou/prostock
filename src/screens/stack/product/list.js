import { useState, useRef } from "react";
import { Main, Button, Message, Column, Input, ScrollVertical, Tabs } from "@/ui";

export default function ProductListScreen() {
    const [tab, settab] = useState("Sobre");
    const types = ["Sobre", "Categorias", "Estoque"];
    return (<Main>
        <Column>
            <Tabs types={types} value={tab} setValue={settab} />
        </Column>
        <ScrollVertical>
        </ScrollVertical>
    </Main>)
}