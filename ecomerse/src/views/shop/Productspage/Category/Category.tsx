import { categoryApi } from "@/utils/Https/apicalls"
import { useQuery } from "@tanstack/react-query"

export const Category = () => {





  const { isPending, data, isError, error } = useQuery({ queryKey: ['category'], queryFn: categoryApi })

  if (isPending) return <div>Loading...</div>

  if (isError) return <div>Error: {error.message}</div>




  return (
    <>


      <div className=" flex  items-center justify-between">
        {data?.data.map((c: any, index) => (


          <div>
            <figure className=" text-center border-4 size-20   rounded-full overflow-hidden  m-auto   border-black   ">
              <img src={c.image} alt="" className="   m-auto" />
            </figure>
            <p className=" text-center font-bold"><a href="" className=''>{c.title}</a></p>
          </div>


        ))}

      </div>

    </>
  )
}
