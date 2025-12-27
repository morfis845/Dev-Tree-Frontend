import type { UserHandle } from "@/types";
import { Icon } from "../../public/SocialIcons/Icon";

type HandleDataProps = {
  data: UserHandle;
};

export default function HandleData({ data }: HandleDataProps) {
  const { handle, name, image, description, links } = data;
  const parsedLinks = JSON.parse(links);
  return (
    <article className="bg-twitch-v/20 p-8 rounded-lg max-w-md mx-auto my-10">
      <header>
        <p className="text-5xl text-center mb-3 text-stroke-color font-black">
          {handle}
        </p>
        {data.image && <img src={image} alt={name} className="" />}
      </header>
      <section className="my-8">
        <p className="text-stroke-color text-center text-2xl">{description}</p>
      </section>
      <footer>
        <ul className="gap-4 flex flex-col">
          {parsedLinks.map(
            (link: {
              id: number;
              name: string;
              url: string;
              enabled: boolean;
            }) =>
              link.enabled && (
                <li key={link.id} className="group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stroke-color font-bold neon w-full p-5  flex gap-6 rounded-lg ring-2 border-stroke-color/50 items-center justify-center"
                  >
                    <Icon
                      name={link.name as keyof typeof Icon}
                      size={32}
                      //color="#f5e1f5"
                      className="group-hover:scale-150 transition-transform duration-300"
                    />
                    <span>{link.name}</span>
                  </a>
                </li>
              )
          )}
        </ul>
      </footer>
    </article>
  );
}

// {parsedLinks.map(
//           (link: any) =>
//             link.enabled && (
//               <div key={link.id} className="">
//                 {link.enabled && (
//                   <div className="">

//                     <ul href={link.url} target="_blank" className="">
//                       {link.name}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )
//         )}
