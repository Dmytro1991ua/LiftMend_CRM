import { FaFilter } from 'react-icons/fa';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const TableFilters = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='w-52 h-8 py-5 px-3 bg-primary text-white' size='sm' variant='outline'>
          <FaFilter className='mr-2 h-4 w-4' />
          <span className='uppercase font-bold'>Filters</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-[30rem]'>
        <Accordion collapsible type='single'>
          <AccordionItem className='px-2' value='item-1'>
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TableFilters;
