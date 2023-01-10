import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class AppService {
  
  static MetaPage: string = fs.readFileSync('./src/meta_page.html', 'utf8');;
  
  getPage(): string { return AppService.MetaPage }; 
  
}
