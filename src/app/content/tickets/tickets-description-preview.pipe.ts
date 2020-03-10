import { Pipe, PipeTransform } from "@angular/core";

/*
 * Shorten a ticket description into preview form
 * Takes an string argument.
 * Usage:
 *   value | preview
 * Example:
 *   {{ 'This is an example ticket description' |  preview }}
 *   formats to: 'This is an exam...'
 */
@Pipe({ name: 'preview' })
export class DescriptionPreview implements PipeTransform {
    transform(value: string): string {
        if (value.length > 70)
            return `${value.substr(0,70)}...`;
        else
            return value;
    }
}