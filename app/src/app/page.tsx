import Image from "next/image";

export default function Home() {
  return (
    <div className='flex items-center justify-center min-h-full min-w-full'>
      <form className="flex flex-col items-center justify-center gap-4 w-full h-full">
        <h1 className='text-4xl'>How nice is this pony?<br /><span className="text-2xl">(upon initial introduction)</span></h1>
        <img className='w-1/2' src="https://static.wikia.nocookie.net/villains/images/8/8f/Nightmare_Moon.png/revision/latest/" />
        <Slider defaultValue={50} marks={nicenessOptions} step={25} />
        <div className="flex gap-2">
          <Button variant='outlined'>Submit</Button>
          <Button variant='outlined'>I'm not sure...</Button>
        </div>
      </form>
    </div>
  );
}
