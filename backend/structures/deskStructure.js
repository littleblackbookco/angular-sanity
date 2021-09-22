import S from "@sanity/desk-tool/structure-builder";

export default () =>
  S.list()
    .title("Desk")
    .items([
      S.listItem()
        .title("Orders")
        .child(S.documentTypeList("order").title("Orders")),
      ...S.documentTypeListItems(),
    ]);
