import { Pipe, PipeTransform } from '@angular/core';

/*
 * Shorten a long string into preview form
 * Takes an string argument.
 * Usage:
 *   value | preview
 * Example:
 *   {{ 'This is an example of a long text string' |  preview }}
 *   formats to: 'This is an exam...'
 */
@Pipe({ name: 'preview' })
export class TextPreview implements PipeTransform {
    transform(value: string): string {
        if (value?.length > 70)
            {return `${value.substr(0,70)}...`;}
        else
            {return value;}
    }
}
