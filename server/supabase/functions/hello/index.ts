import { NestFactory } from "npm:@nestjs/core@^11.1.0";
import { Controller, Get, Module } from "npm:@nestjs/common@^11.1.0";

@Controller()
class IndexController {
  @Get()
  getIndex() {
    return "Hello World!";
  }
}

@Module({ controllers: [IndexController] })
class AppModule {}

const app = await NestFactory.create(AppModule);
app.listen(3000);
