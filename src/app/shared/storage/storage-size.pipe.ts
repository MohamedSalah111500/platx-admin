import { Pipe, PipeTransform } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { formatStorageSize, gbToBytes } from "./storage-size";

@Pipe({
  name: "storageGb",
  standalone: true,
  pure: false,
})
export class StorageGbPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(gb: number | null | undefined): string {
    return formatStorageSize(gbToBytes(gb ?? 0), this.translate);
  }
}
