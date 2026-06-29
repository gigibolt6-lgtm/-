import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface Props {
  math: string;
  block?: boolean;
}

export function Formula({ math, block = false }: Props) {
  return (
    <div className="text-xl sm:text-2xl font-serif">
      {block ? <BlockMath math={math} /> : <InlineMath math={math} />}
    </div>
  );
}
