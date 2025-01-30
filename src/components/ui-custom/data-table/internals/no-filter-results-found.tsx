import Image from 'next/image'

export const NoFilterResultsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex items-center justify-center rounded-full bg-custom-middleBlue p-5">
        <Image
          src="/img/no-results.png"
          alt="No results"
          width={116}
          height={116}
        />
      </div>
      <h2 className="mt-8 text-2xl font-semibold">No results found</h2>
      <h3 className="mt-3 text-base font-medium text-muted-foreground">
        Try adjusting your search and filters
      </h3>
    </div>
  )
}
