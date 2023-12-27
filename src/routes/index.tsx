import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import {MainNav} from "~/components/items/mainnav";
import { HiArrowDownRightOutline } from "@qwikest/icons/heroicons";
import {Addmeals} from "~/components/items/addmeals";

export default component$(() => {
  return (
    <main class="bg-black">
      <div class={"h-70 bg-black flex justify-center"}>
        <div class={"flex flex-col items-center justify-center"}>
          <MainNav name={"Vyhledat fotku jídla"} location={"#linkig"}/>
          <MainNav name={"Nahrát fotku jílda"} location={'#'}/>
        </div>
      </div>
      <div>
        <div>
          <div class={"text-white flex text-2xl"}>
              <HiArrowDownRightOutline class={"w-10 h-10 ml-1"}/>
              <p class={"text-center mr-10"}>Vyberte, ke kterému z dnešních jídel chcete nahrát fotku:</p>
          </div>
        </div>
      </div>
      <div>
          <p class={"text-white"}>Not zion or over there, yearn the freedom.aivca</p>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "jaroska.jidena online",
  meta: [
    {
      name: "description",
      content: "Vyhledejte si, jak jídla na Jarošce vypadají",
    },
      {
      name: "keywords",
      content: "jaroška, jídelna, obědy, oběd, školní"
      },
  ],
};
