import documentation from '@/Documentation/documentation.json';
import { readFileSync } from 'fs';

export default function fetchDocumentation(name: string): string | undefined {
    let doc: any = documentation;
    for (let i of name.split('/')) {
        if (typeof doc == 'object' && i in doc) {
            doc = doc[i];
        }
    }
    if (typeof doc != 'string' || !doc.endsWith('.md')) return undefined;
    try {
        return readFileSync(`Documentation/${doc}`, 'utf8');
    } catch (x) {
        return undefined;
    }
    
}